import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type FoodInput = {
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// 🛠 API lấy chi tiết món ăn
const getFoodDetail = async (id: string): Promise<FoodInput> => {
  const { data } = await axios.get(`http://localhost:3000/foods/${id}`);
  return data;
};

// 🛠 API cập nhật món ăn
const updateFood = async ({ id, ...food }: FoodInput & { id: string }) => {
  return await axios.put(`http://localhost:3000/foods/${id}`, food);
};

function FoodsEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Sử dụng useForm từ react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FoodInput>();

  // ✅ Lấy dữ liệu thực phẩm từ API
  const { data: food, isLoading, isError } = useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodDetail(id as string),
    enabled: !!id,
  });
  useEffect(() => {
    if (food) reset(food);
  }, [food, reset]);
  // ✅ Mutation để cập nhật món ăn
  const mutation = useMutation({
    mutationFn: (data: FoodInput) => updateFood({ id: id as string, ...data }),
    onSuccess: () => {
      alert("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["foods"] }); // Refresh danh sách
      navigate("/admin/food-list");
    },
  });

  // 🛠 Xử lý submit form
  const onSubmitEdit: SubmitHandler<FoodInput> = (data) => {
    mutation.mutate(data);
  };

  // ✅ Kiểm tra trạng thái tải dữ liệu
  if (isLoading) return <p>⏳ Đang tải dữ liệu...</p>;
  if (isError) return <p>❌ Không thể tải dữ liệu. Vui lòng thử lại!</p>;

  return (
    <Container>
      <h1 className="my-4 text-center">Chỉnh sửa món ăn</h1>
      <Form onSubmit={handleSubmit(onSubmitEdit)}>
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

      </Form>
    </Container>
  );
}

export default FoodsEdit;
