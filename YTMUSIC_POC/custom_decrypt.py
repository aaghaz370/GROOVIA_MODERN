import requests
import json
import urllib.parse
from pytubefix.cipher import Cipher

print("Fetching player JS URL from embed page...")
html = requests.get('https://www.youtube.com/embed/ZaURV4XxdPI').text
import re
match = re.search(r'"jsUrl":"([^"]+)"', html)
if match:
    js_url = 'https://www.youtube.com' + match.group(1).replace('\\/', '/')
    print("Player JS:", js_url)

    print("Fetching Player JS Content...")
    js = requests.get(js_url).text
    cipher = Cipher(js=js, js_url=js_url)

    d = json.load(open('song.json'))
    for f in d.get('streamingData', {}).get('adaptiveFormats', []):
        if 'audio' in f.get('mimeType', ''):
            cip = f.get('signatureCipher')
            if cip:
                parsed = urllib.parse.parse_qs(cip)
                url = parsed['url'][0]
                s = parsed['s'][0]
                sp = parsed.get('sp', ['sig'])[0]
                
                print("Decrypting sig...")
                sig = cipher.get_sig(s)
                
                # YouTube also uses 'n' cipher
                print("Decrypting n...")
                parsed_url = urllib.parse.urlparse(url)
                url_qs = urllib.parse.parse_qs(parsed_url.query)
                if 'n' in url_qs:
                    n = url_qs['n'][0]
                    # Since getting n_sig via cipher.get_n() is not universally mapped, 
                    # let's try calling pytubefix's 'get_nsig_function_name'
                    n_func = cipher.get_nsig_function_name()
                    print('N func name:', n_func)
                    
                    calc_n = cipher.cipher_function[n_func](urllib.parse.unquote(n))
                    print('Calculated n_sig:', calc_n)
                    
                    # replace n with n_sig in url
                    url = url.replace(f"&n={n}", f"&n={calc_n}")

                final_url = f"{url}&{sp}={sig}"
                print("FINAL URL:", final_url[:120])
                
                r = requests.head(final_url)
                print("HTTP STATUS:", r.status_code)
                break
else:
    print("Cannot find jsUrl")
