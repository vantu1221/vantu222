import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type MoviesInput = {
  name: string;
  image: string;
  director: string;
  categoryId: number; // ❗ Chuyển thành ID của thể loại
};

type Category = {
  id: number;
  name: string;
};

// 🛠 API thêm phim
const moviesAdd = async (movie: MoviesInput) => {
  return await axios.post("http://localhost:3000/movies", movie);
};

// 🛠 API lấy danh sách thể loại
const fetchCategories = async () => {
  const { data } = await axios.get<Category[]>("http://localhost:3000/categories");
  return data;
};

function MoviesAdd() {
  const { register, handleSubmit, formState: { errors } } = useForm<MoviesInput>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 🛠 Lấy dữ liệu categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const mutation = useMutation({
    mutationFn: moviesAdd,
    onSuccess: () => {
      alert("Thêm phim thành công!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      navigate("/admin/movies-list");
    },
  });

  const onSubmit: SubmitHandler<MoviesInput> = (data) => {
    data.categoryId = Number(data.categoryId); // ép kiểu cho chắc
    mutation.mutate(data);
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Thêm Phim</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Tên</Form.Label>
          <Form.Control
            type="text"
            {...register("name", { required: "Tên là bắt buộc" })}
          />
          {errors.name && <Alert variant="danger">{errors.name.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control
            type="text"
            {...register("image")}
          />
          {errors.image && <Alert variant="danger">{errors.image.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Đạo diễn</Form.Label>
          <Form.Control
            type="text"
            {...register("director", { required: "Tên đạo diễn là bắt buộc" })}
          />
          {errors.director && <Alert variant="danger">{errors.director.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thể loại</Form.Label>
          {isLoading ? (
            <div>Đang tải thể loại...</div>
          ) : (
            <Form.Select {...register("categoryId", { required: "Thể loại là bắt buộc" })}>
              <option value="">-- Chọn thể loại --</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          )}
          {errors.categoryId && <Alert variant="danger">{errors.categoryId.message}</Alert>}
        </Form.Group>

        <Button type="submit" variant="primary" disabled={mutation.isPending}>
          {mutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
        <br />
        <Button variant="secondary" href="/admin/movies-list" className="py-2 mt-3">
          Danh sách phim
        </Button>
      </Form>
    </Container>
  );
}

export default MoviesAdd;
