import cv2
from signin import *
cap = cv2.VideoCapture(0)
signinpy()
detector = cv2.QRCodeDetector()
while True:
    _, img = cap.read()
    data, bbox, _ = detector.detectAndDecode(img)
    
    if(bbox is not None):
        for i in range(len(bbox)):
            cv2.line(img, tuple(bbox[i][0]), tuple(bbox[(i+1) % len(bbox)][0]), color=(255,
                     0, 255), thickness=2)
        cv2.putText(img, data, (int(bbox[0][0][0]), int(bbox[0][0][1]) - 10), cv2.FONT_HERSHEY_SIMPLEX,
                    0.5, (0, 255, 0), 2)
        if data:
            print("data found: ", data)
            response = showdelrevpy(data)
            if(response.json().get('data')):
                print("Success, opening warehouse")
            else:
                print('unvalid')
    cv2.imshow("code detector", img)
    if(cv2.waitKey(1) == ord("q")):
        break
cap.release()
cv2.destroyAllWindows()