import { diskStorage } from "multer";

export const storageConfig = (folder: string) => diskStorage({
    destination: `uploads/${folder}`, //destination xác định thư mục  nơi file sẽ được lưu 
    filename: (req, file, cb) => {
        // Hàm này nhận ba tham số
        // -req: Request object từ client.
        // -file: Thông tin về file được upload (bao gồm tên file, MIME type, kích thước, v.v.).
        //  -cb: 
         // -Kiểm tra file upload (nếu cần).
         // -Tạo tên file mới (tùy chỉnh logic: thêm timestamp, đổi tên, lọc ký tự).
         // -Trả về tên file mới hoặc lỗi nếu có.
         // * Sau khi callback cb được gọi, Multer sẽ dùng giá trị này để lưu file lên hệ thống.
        cb(null, Date.now() + '-' + file.originalname)//Date.now() (timestamp hiện tại lưu vào file )
        // originalname tên file gốc 
    }

})