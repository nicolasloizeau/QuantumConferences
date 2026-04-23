# Design: Github quantum conferences list

## Architecture
conferences.json : list of conferences in json format
README.md : markdown file with the list of conferences formatted as lists grouped by category, and sorted by start date.
website/ : folder containing the website files
website/index.html : main page of the website with the list of conferences and search functionality
website/style.css : stylesheet for the website
website/script.js : javascript file for the search functionality
make.py : python script to generate README.md and website files from conferences.json
clean.py : python script to remove past conference entries from conferences.json based on end date and move them to past_conferences.json
past_conferences.json : json file to store past conference entries removed from conferences.json
.github/workflows/make.yml : github action to run make.py and clean.py on push to main branch
