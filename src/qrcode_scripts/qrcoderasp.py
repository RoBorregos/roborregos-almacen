import cv2
from signin import *
#select source image as video capture
videoCapturer = cv2.VideoCapture(0)
#sign in to post/get API calls
signinpy()
#detect QR in current video capture
QRdetector = cv2.QRCodeDetector()
VideoOn =True
while VideoOn:
    
    #detect and box the QR code detection
    _, QRImage = videoCapturer.read()
    QRdata, bbox, _ = QRdetector.detectAndDecode(QRImage)
    
    #only if QR code was finded
    if(bbox is not None):
        #label output
        for i in range(len(bbox)):
            cv2.line(QRImage, tuple(bbox[i][0]), tuple(bbox[(i+1) % len(bbox)][0]), color=(255,
                     0, 255), thickness=2)
        cv2.putText(QRImage, QRdata, (int(bbox[0][0][0]), int(bbox[0][0][1]) - 10), cv2.FONT_HERSHEY_SIMPLEX,
                    0.5, (0, 255, 0), 2)
        #if data was find for the current QRCODE
        if QRdata:
            print("Data found: ", QRdata)
            #decode responde to json
            API_response = showdelrevpy(QRdata)
            #check if is a valid reservation
            if(API_response.json().get('data')):
                print("Success, opening warehouse")
            #if not valid UUID
            else:
                print('Unvalid')
    #Show image            
    cv2.imshow("code detector", QRImage)
    #if interrumpted, break
    if(cv2.waitKey(1) == ord("q")):
        break
#release capture and close cv2 image show window
videoCapturer.release()
cv2.destroyAllWindows()