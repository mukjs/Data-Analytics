#Import 
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, distinct

import datetime as dt

from flask import Flask, jsonify


# Database Setup

engine = create_engine("sqlite:///hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

# Flask Setup
app = Flask(__name__)


# Flask Routes

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/start_temp/<start><br/>"
        f"/api/v1.0/start_end_temp/<start>/<end>"
    )



@app.route("/api/v1.0/precipitation")
def precipitation():
    """Return a dictionary of date and precipitation values"""
    # Query all date and prcp 
    result = session.query(Measurement.date,Measurement.prcp).all()

    # Convert into dictionary
    prcp_dict = dict(result)

    return jsonify(prcp_dict)




@app.route("/api/v1.0/stations")
def stations():
    """Return a list of all stations"""
    # Query all stations 
    result = session.query(Station.station,Station.name).all()
    
    # Convert into dictionary
    station_dict=dict(result)

    return jsonify(station_dict)




@app.route("/api/v1.0/tobs")
def tobs():
    """Return a list of all temp obs for previous year"""
    # Query 

    # Get latest date in the data.As it is in string format, convert to date format for using in date calc
    max_date_str=session.query(func.max(Measurement.date))[0][0]

    max_date=dt.date(int(max_date_str[0:4]),int(max_date_str[5:7]),int(max_date_str[8:10]))

    #start date: 12 months prior to max date
    start_date=max_date-dt.timedelta(days=365)

    # Perform a query to retrieve the date and temp for last 12 months
    sel=[Measurement.date,Measurement.tobs]

    result = session.query(*sel).\
             filter(Measurement.date>start_date).\
             order_by(Measurement.date).all()

    # Convert into dictionary
    temp_dict=dict(result)

    return jsonify(temp_dict)



@app.route("/api/v1.0/start_temp/<start>")
def start_temp(start):
    """Calculate TMIN, TAVG, and TMAX for all dates greater than and equal to the start date."""
    # Query 
    sel=[func.min(Measurement.tobs),func.avg(Measurement.tobs),func.max(Measurement.tobs)]

    result = session.query(*sel).\
             filter(Measurement.date>=start).all()


    return jsonify(result)


@app.route("/api/v1.0/start_end_temp/<start>/<end>")
def start_end_temp(start,end):
    """Calculate TMIN, TAVG, and TMAX for all dates greater than and equal to the start date and less than or equal to end date."""
    # Query 
    sel=[func.min(Measurement.tobs),func.avg(Measurement.tobs),func.max(Measurement.tobs)]

    result = session.query(*sel).\
             filter(Measurement.date>=start).\
             filter(Measurement.date<=end).all()


    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
