def scrape():
    # Dependencies
    from bs4 import BeautifulSoup
    import requests
    import pymongo
    from splinter import Browser
    import pandas as pd



    #NASA Mars News
    
    #Using splinter
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    # URL of page to be scraped
    url = 'https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest'

    browser.visit(url)

    html = browser.html

    # Create BeautifulSoup object; parse with 'lxml'
    soup = BeautifulSoup(html, 'html.parser')

    # Retrieve the parent divs for all articles
    results = soup.find('li',class_="slide")

    #Retrieve article title and paragraph text
    
    for result in results:
        title = result.find('div',class_="content_title").text
        para_text = result.find('div',class_="rollover_description_inner").text


    #JPL Mars Space Images - Featured Image


    #Using splinter
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url)

    html = browser.html

    soup = BeautifulSoup(html, 'html.parser')

    results = soup.find_all('article',class_="carousel_item")

    # get image url
    for result in results:
        image_url_part=result.get('style') 

    image_url_part=image_url_part[image_url_part.find("(")+2:image_url_part.find(")")-1]

    featured_image_url="https://www.jpl.nasa.gov"+image_url_part




    # Mars Weather


    url = 'https://mobile.twitter.com/marswxreport?lang=en'

    # Retrieve page with the requests module
    response = requests.get(url)

    # Create BeautifulSoup object; parse with 'lxml'
    soup = BeautifulSoup(response.text, 'lxml')

    # Retrieve the parent div for latest tweet
    latest_tweet = soup.find('div',class_="tweet-text").text.strip()
    latest_tweet=latest_tweet[0:latest_tweet.find("pic")-1]



    #Mars Facts

    url='https://space-facts.com/mars/'

    #use pandas to scrape table and store as a data frame
    df_mars_facts = pd.read_html(url)[0]

    df_mars_facts.columns=['Fact','Value']

    #convert the data to a HTML table string
    html_table=df_mars_facts.to_html(index=False,bold_rows=True)



    #Mars Hemispheres

    hemisphere_image_urls = [
        {"title": "Valles Marineris Hemisphere", "img_url": "https://astrogeology.usgs.gov/cache/images/7cf2da4bf549ed01c17f206327be4db7_valles_marineris_enhanced.tif_full.jpg"},
        {"title": "Cerberus Hemisphere", "img_url": "https://astrogeology.usgs.gov/cache/images/cfa62af2557222a02478f1fcd781d445_cerberus_enhanced.tif_full.jpg"},
        {"title": "Schiaparelli Hemisphere", "img_url": "https://astrogeology.usgs.gov/cache/images/3cdd1cbf5e0813bba925c9030d13b62e_schiaparelli_enhanced.tif_full.jpg"},
        {"title": "Syrtis Major Hemisphere", "img_url": "https://astrogeology.usgs.gov/cache/images/ae209b4e408bb6c3e67b6af38168cf28_syrtis_major_enhanced.tif_full.jpg"},
    ]


    #Dictionary of all items scraped

    dict_scrape={
        "news_title":title,
        "news_text":para_text,
        "featured_image":featured_image_url,
        "mars_weather":latest_tweet,
        "mars_facts":html_table,
        "hemispheres":hemisphere_image_urls
    }

    # Close the browser after scraping
    browser.quit()
    
    return dict_scrape