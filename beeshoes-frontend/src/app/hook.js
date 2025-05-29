import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// gọi đến hàm CRUD của reducer 
export const useAppDispatch = () => useDispatch();

// lấy dữ liệu reducer ra 
export const useAppSelector = useSelector;