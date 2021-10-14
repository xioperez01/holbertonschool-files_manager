import base64
import requests
import sys

file_path = sys.argv[1]
file_name = file_path.split('/')[-1]

file_encoded = None

with open(file_path, "rb") as image_file:
    file_encoded = base64.b64encode(image_file.read()).decode('utf-8')


r_json = { 'name': file_name, 'type': 'image', 'isPublic': True, 'data': file_encoded, 'parentId': sys.argv[3] }
r_headers = { 'X-Token': sys.argv[2] }

print("File Path is:", file_path, sys.argv[1])
print("File Name is:", file_name)
print("Parent ID is:", r_json['parentId'], sys.argv[3])
print("X Token is:", r_headers['X-Token'], sys.argv[2])
print(sys.argv)
r = requests.post("http://0.0.0.0:5000/files", json=r_json, headers=r_headers)
print(r.json())
