import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type MoviesInput = {
  name: string;
  image: string;
  director: string;
};

// 🛠 API thêm món ăn
const moviesAdd = async (food: MoviesInput) => {
  return await axios.post("http://localhost:3000/movies", food);
};

function MoviesAdd() {
  const { register, handleSubmit, formState: { errors } } = useForm<MoviesInput>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Mutation để thêm món ăn
  const mutation = useMutation({
    mutationFn: moviesAdd,
    onSuccess: () => {
      alert("Thêm  thành công!");
      queryClient.invalidateQueries({ queryKey: ["movies"] }); // Cập nhật danh sách món ăn
      navigate("/admin/movies-list");
    },
  });

  // 🛠 Xử lý submit form
  const onSubmit: SubmitHandler<MoviesInput> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Thêm Phim</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Tên</Form.Label>
          <Form.Control type="text" {...register("name", { required: "Tên  là bắt buộc" })} />
          {errors.name && <Alert variant="danger">{errors.name.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control type="text" {...register("image")} />
          {errors.image && <Alert variant="danger">{errors.image.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Đạo diễn</Form.Label>
          <Form.Control type="text" {...register("director", { required: "Tên đạo diễn là bắt buộc" })} />
          {errors.director && <Alert variant="danger">{errors.director.message}</Alert>}
        </Form.Group>
        <Button type="submit" variant="primary" disabled={mutation.isPending}>
             {mutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
        <br />
        <Button variant="secondary" href="/admin/movies-list" className="py-2 mt-3">Danh sách</Button>
      </Form>
    </Container>
  );
}

export default MoviesAdd;
