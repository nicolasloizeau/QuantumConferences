
# Specs: Github quantum conferences list

## Description
This is a github repo for listing quantum conferences.

## Inputs
A json file called `conferences.json` with the following format:
```json
[
  {
    "name": "Conference name",
    "url": "https://conference.url",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "registration_deadline": "YYYY-MM-DD",
    "submission_deadline": "YYYY-MM-DD",
    "location": "City, Country",
    "keywords": "keyword1, keyword2, keyword3"
    "category": "Category name"
  },
]
```

## Outputs
- A markdown file called `README.md` with the list of conferences formatted as tables grouped by category, and sorted by start date. And an contribute section with instructions on how to add a conference to the list.
- A website with a list of conferences generated from `conferences.json`, with a search functionality to filter conferences by keywords and categories.
