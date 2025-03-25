import { useEffect, useState } from "react";
import { Foods } from "../foods/foods";
import axios from "axios";
import { Table, Button, Container } from "react-bootstrap";

function Homepage() {
    const [foods, setFoods] = useState<Foods[]>([]);

   const getFoods = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/foods');
            setFoods(data);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteFoods = async (id: number) => {
        try {
            if (window.confirm('Bạn muốn xóa không?')) {
                await axios.delete(`http://localhost:3000/foods/${id}`);
                alert('Xóa Thành công');
                getFoods(); // Refresh list after deletion
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getFoods();
    }, []);

    return (
        <Container>
            <h1 className="my-4 text-center">Danh sách sản phẩm</h1>
            <Button variant="success" href="food-add" className="mb-3">Add Food</Button>
            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((p, index) => (
                        <tr key={index}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.price}</td>
                            <td>
                                <img src={p.image} alt={p.name} className="img-thumbnail" style={{ width: "80px", height: "80px" }} />
                            </td>
                            <td>{p.quantity}</td>
                            <td>
                                <Button variant="info" href={`food-detail/${p.id}`} className="me-2">Detail</Button>
                                <Button variant="warning" href={`food-edit/${p.id}`} className="me-2">Edit</Button>
                                <Button variant="danger" onClick={() => deleteFoods(p.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default Homepage;
