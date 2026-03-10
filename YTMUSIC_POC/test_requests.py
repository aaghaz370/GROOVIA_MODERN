import requests
with open('cookies.txt', 'r') as f:
    cookies = f.read()

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'cookie': cookies
}
r = requests.get('https://music.youtube.com/watch?v=CK5dtbG19mo', headers=headers)
print(r.status_code)
