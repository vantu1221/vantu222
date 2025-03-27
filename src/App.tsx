import { useRoutes } from "react-router-dom";
import "./App.css";
import AdminLayout from "./layouts/AdminLayout";
import Homepage from "./pages/foodsList";
import FoodsAdd from "./pages/foodsAdd";
import FoodsEdit from "./pages/foodsEdit";
import FoodDetail from "./pages/detailFoods";

const routeConfigs = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "food-list", element: <Homepage /> },
      { path: "food-add", element: <FoodsAdd /> },
      { path: "food-edit/:id", element: <FoodsEdit /> },
      { path: "food-detail/:id", element: <FoodDetail /> },
    ],
  },
];

function App() {
  const routes = useRoutes(routeConfigs);
  return <div>{routes}</div>;
}

export default App;
