# use an official Python runtime as a parent image
FROM python:3.12-bookworm

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PTHONNUNBUFFERRED 1

# Install system dependencies for GeoDjango
RUN apt-get update && apt-get install -y binutils libproj-dev gdal-bin

# set the working directory in the container
WORKDIR /app

# copy the requirements.txt file
COPY ./requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# copy the current directory contents into the container at /app
COPY . .

# # Expose the port the app runs on
# EXPOSE 8000

# # Run the application
# CMD [ "python", "manage.py","runserver", "0.0.0.0:8000" ]