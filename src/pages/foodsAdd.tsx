import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type FoodInput = {
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// 🛠 API thêm món ăn
const addFood = async (food: FoodInput) => {
  return await axios.post("http://localhost:3000/foods", food);
};

function FoodsAdd() {
  const { register, handleSubmit, formState: { errors } } = useForm<FoodInput>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Mutation để thêm món ăn
  const mutation = useMutation({
    mutationFn: addFood,
    onSuccess: () => {
      alert("Thêm món ăn thành công!");
      queryClient.invalidateQueries({ queryKey: ["foods"] }); // Cập nhật danh sách món ăn
      navigate("/admin/food-list");
    },
  });

  // 🛠 Xử lý submit form
  const onSubmit: SubmitHandler<FoodInput> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Thêm món ăn</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Tên món</Form.Label>
          <Form.Control type="text" {...register("name", { required: "Tên món là bắt buộc" })} />
          {errors.name && <Alert variant="danger">{errors.name.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control type="text" {...register("image", { required: "Link hình ảnh là bắt buộc" })} />
          {errors.image && <Alert variant="danger">{errors.image.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá</Form.Label>
          <Form.Control type="number" {...register("price", { required: "Giá món ăn là bắt buộc" })} />
          {errors.price && <Alert variant="danger">{errors.price.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số lượng</Form.Label>
          <Form.Control type="number" {...register("quantity", { required: "Số lượng là bắt buộc" })} />
          {errors.quantity && <Alert variant="danger">{errors.quantity.message}</Alert>}
        </Form.Group>

        <Button type="submit" variant="primary" disabled={mutation.isPending}>
             {mutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
        <br />
        <Button variant="secondary" href="/admin/food-list" className="py-2 mt-3">Danh sách</Button>
      </Form>
    </Container>
  );
}

export default FoodsAdd;
