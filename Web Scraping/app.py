from flask import Flask, render_template,redirect

# Import our pymongo library, which lets us connect our Flask app to our Mongo database.
import pymongo
from scrape_mars import scrape

# # Create an instance of Flask
app = Flask(__name__)

# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
db = client.mars_db


# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Find one record of data from the mongo database
    destination_data = list(db.mars_web_scraping.find())
    
    
    # Return template and data
    return render_template("index.html", mars=destination_data)
    

# # Route that will trigger the scrape function
@app.route("/scraper")
def scraper():

    # #Call scrape function and save the output in a variable
    scrape_data=scrape()
    
    # # Drops collection if available to remove duplicates
    db.mars_web_scraping.drop()
    
    # #Insert scrape_data into mars_web_scraping collection
    db.mars_web_scraping.insert_one(scrape_data)

    # # Redirect back to home page
    return redirect("/")
    


if __name__ == "__main__":
    app.run(debug=True)
