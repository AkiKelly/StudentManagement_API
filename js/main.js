
//tạo mảng chứa danh sách SV trả về 
let studentList = [];

//Function 1: lấy danh sách sinh viên từ backend
const fetchStudents = () => {
  axios({
    //copy đường dẫn API backend cho vào url
    url: "http://svcy.myclass.vn/api/SinhVien/LayDanhSachSinhVien",
    // method: phương thức muốn sử dụng
    method: "GET",
  })
    // nếu thành công
    .then((res) => {
      //res.data là dữ liệu từ backend trả về. Để dùng thì gán vào biến studentList
      studentList = res.data;
      //gọi hàm in ra UI
      renderStudents();
    })
    // nếu thất bại
    .catch((err) => {
      console.log(err);
    });
};

//function 2: hiển thị danh sách sinh viên ra màn hình
const renderStudents = () => {
  //giao diện của một sinh viên
  // <tr>
  //   <td>123</td>
  //   <td>Đặng Trung Hiếu</td>
  //   <td>dangtrunghieu147@gmail.com</td>
  //   <td>0334643124</td>
  //   <td>1</td>
  //   <td>2</td>
  //   <td>3</td>
  //   <td></td>
  // </tr>;
  //Duyệt  studentList, có bao nhiêu SV => <tr>
  let htmlContent = "";
  for (let student of studentList) {
    // dùng dấu ` String Template để có thể viết nhiều dòng rời rạc
    // thêm nút xóa, nút Update tại <td> cuối cùng
    htmlContent += `
    <tr>
         <td>${student.MaSV}</td>
         <td>${student.HoTen}</td>
         <td>${student.Email}</td>
         <td>${student.SoDT}</td>
         <td>${student.DiemToan}</td>
         <td>${student.DiemLy}</td>
         <td>${student.DiemHoa}</td>
          <td>
            <button class="btn btn-danger" onclick="deleteStudent('${student.MaSV}')">Xóa</button>
            <button class="btn btn-info" onclick="getStudent('${student.MaSV}')">Cập nhật</button>
          </td>
     </tr>`;
    console.log(student, htmlContent);
  }
  console.log(htmlContent);
  //đổ nội dung htmlContent lên UI
  document.getElementById("tableDanhSach").innerHTML = htmlContent;
};

//function 3 : thêm sinh viên
const addStudent = () => {
  // Dom tới id của các input trong Form SV để lấy giá trị user nhập
  const studentId = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const idCard = document.getElementById("idCard").value;
  const math = document.getElementById("math").value;
  const physics = document.getElementById("physics").value;
  const chemistry = document.getElementById("chemistry").value;

  //tạo đối tượng SV để lưu thông tin này
  const newStudent = new Student(
    studentId,
    name,
    email,
    phone,
    idCard,
    math,
    physics,
    chemistry
  );

  //gửi request thêm SV cho backend để họ thêm vào Database
  axios({
    url: "http://svcy.myclass.vn/api/SinhVien/ThemSinhVien",
    method: "POST",
    data: newStudent,
  })
  //axios trả về đối tượng promise .then().catch()
    .then((res) => {
      //fetch danh sách student mới để hiện lại UI, mà ko cần nhấn F5
      fetchStudents();
    })
    .catch((err) => {
      console.log(err);
    });
};

//function 4: Xóa sinh viên
const deleteStudent = (id) => {
  axios({
    url: `http://svcy.myclass.vn/api/SinhVien/XoaSinhVien/${id}`,
    method: "DELETE",
  })
    .then((res) => {
      // console.log(res);
      //sau khi xóa thì fetch lại DS mới
      fetchStudents();
    })
    .catch((err) => {
      console.log(err);
    });
};

// function 5: lấy thông tin của sinh viên muốn cập nhật và show lên form
// nhấn nút xóa nào thì truyền mã SV vào
const getStudent = (id) => {
  //call api của backend để lấy thông tin của 1 SV bằng id
  axios({
    url: `http://svcy.myclass.vn/api/SinhVien/LayThongTinSinhVien/${id}`,
    method: "GET",
  })
    .then((res) => {
      console.log(res);
      //Nhấn cập nhật thì bung ra Form SV như nhấn nút Thêm SV
      //Dom tới id của nút ThêmSV và yêu cầu nó click theo
      document.getElementById("btnThem").click();

      //Show thông tin lên Form SV. 
      //Dom tới từng ô input →lấy value rồi gán với dữ liệu do backend trả về vào (res.data)
      document.getElementById("id").value = res.data.MaSV;
      document.getElementById("name").value = res.data.HoTen;
      document.getElementById("email").value = res.data.Email;
      document.getElementById("phone").value = res.data.SoDT;
      document.getElementById("idCard").value = res.data.CMND;
      document.getElementById("math").value = res.data.DiemToan;
      document.getElementById("physics").value = res.data.DiemLy;
      document.getElementById("chemistry").value = res.data.DiemHoa;

      // Ko cho người dùng thay đổi ô Mã SV
      document.getElementById("id").setAttribute("disabled", true);
    })
    .catch((err) => {
      console.log(err);
    });
};

//function 6: cập nhật thông tin sinh viên

const updateStudent = () => {
  //Lấy thông tin SV ra
  const studentId = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const idCard = document.getElementById("idCard").value;
  const math = document.getElementById("math").value;
  const physics = document.getElementById("physics").value;
  const chemistry = document.getElementById("chemistry").value;

  // tạo đối tượng mới
  const updatedStudent = new Student(
    studentId,
    name,
    email,
    phone,
    idCard,
    math,
    physics,
    chemistry
  );

  axios({
    url: "http://svcy.myclass.vn/api/SinhVien/CapNhatThongTinSinhVien",
    method: "PUT",
    data: updatedStudent,
  })
    .then((res) => {
      // nhấn nút cập nhật thì trigger đến nút reset lẫn nút close Form luôn
      //clear form
      document.getElementById("btnReset").click();

      //ẩn popup
      document.getElementById("btnClose").click();

      //mở khóa ô input id để khi Thêm sinh viên sẽ thêm được mã SV
      document.getElementById("id").removeAttribute("disabled");

      //fetch danh sách student mới
      fetchStudents();
    })
    .catch((err) => {
      console.log(err);
    });
};

// muốn hàm này chạy ngay khi mở mà ko cần sự kiện gì
fetchStudents();
