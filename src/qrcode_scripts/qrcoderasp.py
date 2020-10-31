import cv2
from signin import *
#select source image as video capture
cap = cv2.VideoCapture(0)
#sign in to post/get API calls
signinpy()
#detect QE in current video capture
detector = cv2.QRCodeDetector()
VideoOn =True
while VideoOn:
    
    #detect and box the QR code detection
    _, img = cap.read()
    data, bbox, _ = detector.detectAndDecode(img)
    
    #only if QR code was finded
    if(bbox is not None):
        #label output
        for i in range(len(bbox)):
            cv2.line(img, tuple(bbox[i][0]), tuple(bbox[(i+1) % len(bbox)][0]), color=(255,
                     0, 255), thickness=2)
        cv2.putText(img, data, (int(bbox[0][0][0]), int(bbox[0][0][1]) - 10), cv2.FONT_HERSHEY_SIMPLEX,
                    0.5, (0, 255, 0), 2)
        #if data was find for the current QRCODE
        if data:
            print("data found: ", data)
            #decode responde to json
            response = showdelrevpy(data)
            #check if is a valid reservation
            if(response.json().get('data')):
                print("Success, opening warehouse")
            #if not valid UUID
            else:
                print('unvalid')
    #Show image            
    cv2.imshow("code detector", img)
    #if interrumpted, break
    if(cv2.waitKey(1) == ord("q")):
        break
#release capture and close cv2 image show window
cap.release()
cv2.destroyAllWindows()