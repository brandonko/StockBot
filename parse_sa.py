import requests
from bs4 import BeautifulSoup
import json
import sys

# get the link of the mainpage and convert it to beautiful soup for parsing
page = "https://seekingalpha.com/market-news/all"
r = requests.get(page)
soup = BeautifulSoup(r.content, "lxml")

data = {}
next_attr = soup.find(attrs={"class" : "next"})
temp_breaker_count = 0
for ticker in soup.find_all(attrs={"class" : "mc"}):
    temp_breaker_count += 1
    ticker_name = ticker.find(attrs={"class" : "media-left"}).text.strip()
    news_title = ticker.find(attrs={"class" : "title"}).text.strip()
    bullets_header = ticker.find(attrs={"class" : "bullets"})
    bullets = [bullet.text.strip().replace("\'", "`") for bullet in bullets_header.find_all("li")]
    internal_json = {"title" : news_title, "bullets" : bullets}
    internal_json = json.dumps(internal_json)
    data[ticker_name] = internal_json
    if temp_breaker_count > 1:
        break

json_final_data = json.dumps(data)
print(json_final_data)
sys.stdout.flush()
