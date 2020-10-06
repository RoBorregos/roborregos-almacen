import requests
member_token=''
def signinpy():
    url = "https://roborregos-dashboard.herokuapp.com/api/v1/sign_in?username=balam00&password=balam00"

    payload = {}
    headers = {
    'Authorization': 'Token token=83188e49-2ee4-4d15-9d15-c2ea951ebdfe'
    }

    response = requests.request("POST", url, headers=headers, data = payload)
    global member_token
    print(response.text.encode('utf8'))
    member_token = response.json().get('token')
    #print(member_token)

def showdelrevpy (UUID_rev):
    url = "https://roborregos-dashboard.herokuapp.com/api/v1/reservations/"+ UUID_rev
    global member_token
    payload = {}
    headers = {
    'Authorization': 'Token token=f024daf7-def5-4268-92f8-ef39c3ac7604, member_token='+ member_token
    }

    response = requests.request("GET", url, headers=headers, data = payload)
    return response
    print(response.text.encode('utf8'))