export function AlgorithmPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Thuật toán và Kiến trúc</h1>
      <p className="text-gray-600 mb-6">
        Đây là trang dành riêng để trình bày các thuật toán và kiến trúc mà
        chúng tôi đã áp dụng trong hệ thống của mình. Tại đây, bạn sẽ tìm thấy
        các giải thích chi tiết về cách chúng tôi xử lý dữ liệu, tối ưu hóa hiệu
        suất và đảm bảo tính bảo mật cho người dùng.
      </p>

      <h2 className="text-xl font-semibold mb-3">Thuật toán</h2>
      <p className="text-gray-600 mb-4">
        Chúng tôi sử dụng nhiều thuật toán khác nhau để cải thiện trải nghiệm
        người dùng, bao gồm:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>
          <strong>Thuật toán gợi ý:</strong> Dựa trên hành vi và sở thích của
          người dùng để đề xuất nội dung phù hợp.
        </li>
        <li>
          <strong>Thuật toán tìm kiếm:</strong> Cải thiện kết quả tìm kiếm bằng
          cách sử dụng các kỹ thuật xử lý ngôn ngữ tự nhiên.
        </li>
        <li>
          <strong>Thuật toán phân loại:</strong> Phân loại nội dung để đảm bảo
          rằng người dùng nhận được thông tin chính xác và hữu ích.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">Kiến trúc</h2>
      <p className="text-gray-600 mb-4">
        Hệ thống của chúng tôi được xây dựng trên một kiến trúc hiện đại, bao
        gồm:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>
          <strong>Kiến trúc microservices:</strong> Cho phép chúng tôi phát
          triển và triển khai các dịch vụ một cách độc lập, tăng tính linh hoạt
          và khả năng mở rộng.
        </li>
        <li>
          <strong>Kiến trúc serverless:</strong> Sử dụng các dịch vụ đám mây để
          giảm thiểu chi phí và tăng hiệu suất.
        </li>
        <li>
          <strong>Kiến trúc event-driven:</strong> Cho phép hệ thống phản ứng
          nhanh chóng với các sự kiện và thay đổi trong thời gian thực.
        </li>
      </ul>

      <p className="text-gray-600">
        Chúng tôi cam kết tiếp tục cải tiến và áp dụng những công nghệ mới nhất
        để mang lại trải nghiệm tốt nhất cho người dùng của mình.
      </p>
    </div>
  );
}
