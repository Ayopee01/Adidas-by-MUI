🛒 Adidas-by-MUI

This project is a simulation of an E-commerce platform. The frontend is developed using React and MUI (Material-UI), while the backend is built with Node.js, Express.js, and Axios. The backend connects to mock data in JSON format, located in the Backend folder (WebService-API-Adidas), and provides this data to be displayed on the frontend.

How to Use
1. Clone this project and install all required dependencies using npm install.
2. Run the project with npm run dev as usual, and you will be able to view the results of this project.

Features
- Navbar: A sticky navigation bar with smooth scrolling for convenient navigation between different sections of the project.
- Hero: Displays a looping .mp4 video as the background with overlaying text.
- Product: Fetches product data in JSON format and displays each product in a card format. Each card shows details such as product name, image, color, description, price, quantity, and size. Includes an “Add to Cart” button.
- ProductDetail: Clicking on a product card opens a detailed view page, showing complete product information. You can also add the product to your cart from this page, and select the quantity to add.
- CartDrawer: A popup drawer that shows products added to the cart, including details such as name, price, quantity, and total price. Allows you to increase/decrease/edit quantities (CRUD), change product color/size, confirm your order, or clear the entire cart.
- PaymentModal: Simulates a payment screen, which appears after confirming your order in the CartDrawer. Displays ordered items and the total price. Includes a form to fill in your name, address, phone number, and email (all fields validated). You can select between 
Two payment methods:
1. Credit Card: Enter card number, cardholder name, expiration date, and CVC, with full validation.
2. Cash on Delivery: Simply confirm your order.
- Contact: A contact form where users can enter their name, phone number, email, subject, and message. The form uses EmailJS to send the message to a configured email. Includes clear and submit buttons.

Thank you!

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🛒 Adidas-by-MUI

Project นี้เป็นการจำลอง Web รูปแบบของ E-commerce platform โดยจะพัฒนาในส่วนของ Frontend ด้วย React and MUI(Material-ui) 
พัฒนาในส่วน Backend ด้วย Node JS, Express.js and axios โดยเชื่อมต่อข้อมูลจำลองรูปแบบ Json ใน Folder Backend (WebService-API-Adidas) ของ Project ดึงข้อมูลมาแสดงในส่วนของ Front end

วิธีใช้งาน
1. Clone project นี้แล้วทำการติดตั้ง npm i ต่างๆ
3. npm run dev ตามปกติก็จะสามารถรับชมผลงาน project นี้ได้

ฟังก์ชั่น
- Navbar เป็นรูปแบบ A sticky navigation bar และสามารถกด Smooth scrolling เพื่อให้สามารถไปยัง เมนูต่างๆได้อย่างสะดวกยิ่งขึ้นโดยจะ Link ไปในแต่ละ Section ที่มีใน Project
- Hero เป็นรูปแบบ Video mp.4 มาแสดงในรูปแบบวนลูบและมี Text มาแสดงซ้อนไว้
- Product จะรับข้อมูล Json มาแสดงในรูปแบบของ Card product โดยจะมีข้อมูล เช่น ชื่อ รูปภาพ สี รายละเอียด ราคาสินค้า จำนวน และไซต์ของสินค้า มีปุ่ม Add to cart เพื่อเพิ่มสินค้าลงตระกร้า
- ProductDetail สามารถกดเข้าไปใน Card product เพื่อดูข้อมูลแบบครบถ้วนได้ที่หน้านี้ และยังมีปุ่ม Add to cart เพิ่มสินค้าลงตระกร้าได้เหมือนกันกับส่วนของ Card product และยังสามารถเลือกจำนวนที่จะเพิ่มลงตระกร้าสินค้าได้
- CartDrawer จะเป็นรูปแบบของ pop up ขึ้นมาจะแสดงสินค้าที่ถูกเพิ่มลงมาในตระกร้า จะแสดงรายละเอียดของสินค้าจำนวนราคาและราคาทั้งหมดที่มีในตระกร้า มีปุ่มเพิ่มลบแก้ไขจำนวนในรูปแบบของระบบ CRUD และยังสามารถลบเปลี่ยน สีและขนาดได้ มีปุ่มยืนยันออเดอร์ และ เคลียร์ออเดอร์ทั้งหมดออกจาก ตระกร้า
- PaymentModal จะเป็นการจำลองรูปแบบหน้าจ่ายเงินโดยจะทำงานหลังจาก กดปุ่มยืนยันออเดอร์ใน CartDrawer ก็จะแสดงหน้านี้โดยจะแสดงรายการที่สั่งซื้อ ราคาสินค้าและราคาทั้งหมด จะมี Form ให้กรอก ชื่อ-นามสกุล ที่อยู่ เบอร์โทร และ Email โดยจะ validation ไว้ทั้งหมด และยังสามรถเลือกวิธีจ่ายเงินได้ 2 รูปแบบ
1. บัตรเครดิต จะมีให้กรอก เลขบัตร ชื่อบัตร เลือกวันปี และเลข CVC โดยจะ validation ไว้เหมือนกันทั้งหมด
2. เก็บเงินปลายทาง โดยจะสามารถกด ยืนยันได้เลย
- Contact จะเป็น Form ให้กรอก ชื่อ-นามสกุล เบอร์โทร Email หัวเรื่อง และ ข้อความ โดยจะส่งเข้า Email ที่ถูกตั้งค่าไว้ในรูปแบบ EmailJS มีปุ่ม เคลียร์ และ ยืนยืน

ขอบคุณครับ
