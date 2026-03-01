"""
export_cookies.py — Export YouTube cookies from Chrome to cookies.txt

INSTRUCTIONS:
1. Close Chrome completely (all windows + wait 5 seconds)
2. Run: python export_cookies.py
3. cookies.txt will be created next to this file
4. Restart the backend server
"""

import os
import sys
import shutil
import sqlite3
import tempfile
import json
import struct
import time
from pathlib import Path
from http.cookiejar import MozillaCookieJar

def find_chrome_cookies():
    """Find Chrome cookies database path on Windows"""
    base = os.environ.get("LOCALAPPDATA", "")
    paths = [
        os.path.join(base, "Google", "Chrome", "User Data", "Default", "Cookies"),
        os.path.join(base, "Google", "Chrome", "User Data", "Default", "Network", "Cookies"),
        os.path.join(base, "Microsoft", "Edge", "User Data", "Default", "Cookies"),
        os.path.join(base, "Microsoft", "Edge", "User Data", "Default", "Network", "Cookies"),
    ]
    for p in paths:
        if os.path.exists(p):
            return p
    return None


def decrypt_windows(encrypted_value):
    """Decrypt Chrome cookie value using Windows DPAPI"""
    try:
        import ctypes
        import ctypes.wintypes

        class DATA_BLOB(ctypes.Structure):
            _fields_ = [("cbData", ctypes.wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]

        p = ctypes.create_string_buffer(encrypted_value)
        blobin = DATA_BLOB(ctypes.sizeof(p), p)
        blobout = DATA_BLOB()
        retval = ctypes.windll.crypt32.CryptUnprotectData(
            ctypes.byref(blobin), None, None, None, None, 0, ctypes.byref(blobout)
        )
        if not retval:
            return None
        result = ctypes.string_at(blobout.pbData, blobout.cbData)
        ctypes.windll.kernel32.LocalFree(blobout.pbData)
        return result.decode("utf-8", errors="replace")
    except Exception as e:
        return None


def get_encryption_key(cookies_path):
    """Get AES key for Chrome 80+ cookie encryption"""
    try:
        import base64
        # cookies_path can be .../Default/Network/Cookies or .../Default/Cookies
        # Local State is at .../User Data/Local State
        p = Path(cookies_path)
        # Walk up until we find Local State
        for parent in [p.parent, p.parent.parent, p.parent.parent.parent]:
            ls = parent / "Local State"
            if ls.exists():
                with open(ls, "r", encoding="utf-8") as f:
                    local_state = json.load(f)
                encrypted_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])[5:]
                key = decrypt_windows(encrypted_key)
                return key.encode("latin-1") if key else None
        print("  Local State not found in any parent directory")
        return None
    except Exception as e:
        print(f"  Key extraction failed: {e}")
        return None


def decrypt_v10_v20(encrypted_value, key):
    """Decrypt Chrome v10+ cookies (AES-256-GCM)"""
    try:
        from Crypto.Cipher import AES
        if encrypted_value[:3] in (b"v10", b"v20"):
            nonce = encrypted_value[3:15]
            ciphertext = encrypted_value[15:-16]
            tag = encrypted_value[-16:]
            cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
            return cipher.decrypt_and_verify(ciphertext, tag).decode("utf-8", errors="replace")
    except ImportError:
        pass
    except Exception:
        pass
    return None


def export_cookies(output_path="cookies.txt"):
    print("🔍 Looking for Chrome/Edge cookie database...")
    cookie_db = find_chrome_cookies()
    
    if not cookie_db:
        print("❌ Chrome/Edge cookies not found!")
        print("   Try closing Chrome and running again.")
        sys.exit(1)
    
    print(f"✅ Found: {cookie_db}")
    
    # Copy to temp to avoid lock issues
    tmp = tempfile.mktemp(suffix=".db")
    try:
        shutil.copy2(cookie_db, tmp)
    except PermissionError:
        print("❌ Chrome is still running! Close ALL Chrome windows first, then run this script.")
        sys.exit(1)

    # Try to get encryption key
    key_bytes = None
    try:
        raw_key = get_encryption_key(cookie_db)
        if raw_key and len(raw_key) == 32:
            key_bytes = raw_key
            print("🔑 Got AES encryption key")
        else:
            print("⚠️  Could not get AES key, trying DPAPI...")
    except Exception as e:
        print(f"⚠️  Key error: {e}")

    # Export YouTube cookies to Netscape format
    conn = sqlite3.connect(tmp)
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT host_key, name, path, is_secure, expires_utc, value, encrypted_value
            FROM cookies
            WHERE host_key LIKE '%youtube.com' OR host_key LIKE '%google.com'
        """)
    except Exception:
        cursor.execute("""
            SELECT host_key, name, path, is_secure, expires_utc, value, encrypted_value
            FROM cookies
        """)
    
    rows = cursor.fetchall()
    conn.close()
    os.unlink(tmp)

    print(f"📦 Processing {len(rows)} cookies...")

    # Write Netscape cookies file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(script_dir, output_path)
    
    written = 0
    with open(out, "w", encoding="utf-8") as f:
        f.write("# Netscape HTTP Cookie File\n")
        f.write("# Exported by export_cookies.py\n\n")
        
        for host_key, name, path, is_secure, expires_utc, value, encrypted_value in rows:
            # Decrypt value
            decrypted = value
            if not decrypted and encrypted_value:
                if key_bytes and encrypted_value[:3] in (b"v10", b"v20"):
                    decrypted = decrypt_v10_v20(encrypted_value, key_bytes)
                if not decrypted:
                    decrypted = decrypt_windows(encrypted_value)
                if not decrypted:
                    decrypted = ""

            if not decrypted:
                continue

            # Convert Chrome epoch to Unix timestamp
            # Chrome uses microseconds since Jan 1, 1601
            if expires_utc > 0:
                unix_ts = int((expires_utc - 11644473600000000) / 1000000)
            else:
                unix_ts = 0

            secure = "TRUE" if is_secure else "FALSE"
            include_sub = "TRUE" if host_key.startswith(".") else "FALSE"

            f.write(f"{host_key}\t{include_sub}\t{path}\t{secure}\t{unix_ts}\t{name}\t{decrypted}\n")
            written += 1

    print(f"✅ Saved {written} cookies to: {out}")
    print(f"\n🎉 Done! Now restart the backend server:")
    print(f"   .\\venv\\Scripts\\python server.py")


if __name__ == "__main__":
    export_cookies()
