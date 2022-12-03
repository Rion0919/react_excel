// import './App.css';
import ExcelJS from 'exceljs';
import { addData, deleteData, getDatas } from './firebase';
import { v4 as uuid } from 'uuid';
import { useEffect, useState } from 'react';
import {
  Stack,
  TextField,
  Box,
  Button,
  List,
  Grid,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import Snack from './components/Snack';
import Header from './components/Header';
import Footer from './components/Footer';


function App() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(
    moment(new Date()).format('YYYY年MM月DD日 HH時mm')
  );
  const [price, setPrice] = useState('');
  const [data, setData] = useState([]);
  const [sum, setSum] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getDatas().then(res => setData(res))
  }, [])

  const inputHandler = (e) => {
    e.preventDefault();
    if (title === '' || date === "" || price === '') {
      setOpen(true);
      return;
    }
    const dataObj = {
      id: uuid(),
      title: title,
      date: moment(date).format('YYYY年MM日DD月 hh時mm分'),
      price: Number(price).toLocaleString(),
    };
    const newData = [...data, dataObj];
    console.log(newData);
    setData(newData);
    addData(dataObj.id, dataObj.title, dataObj.date, dataObj.price)
    setSum((prev) => prev + Number(price));
    setTitle('');
    setDate(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    setPrice('');
  };

  const onClickExport = async (e, data) => {
    e.preventDefault();

    // Workbookのインスタンス
    const workbook = new ExcelJS.Workbook();
    // Workbookに新しいWorksheetを追加
    workbook.addWorksheet(`${new Date().getMonth() + 1}月分出費`);
    const worksheet = workbook.getWorksheet(`${new Date().getMonth() + 1}月分出費`);

    //列を定義
    worksheet.columns = [
      { header: '使用用途', key: 'title', font: {bold: 'true'}, style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'ff00ff00'}}}},
      { header: '日付', key: 'date', width: 23, font: {bold: 'true'}, style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'ff00ff00'}}} },
      { header: '金額', key: 'price', font: {bold: 'true'}, style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'ff00ff00'}}}},
    ];
    worksheet.views = [
      {state: 'frozen', ySplit: 1}
    ]

    //行を定義
    data.forEach((data) => worksheet.addRow(data));
    worksheet.addRow(["合計金額", `${sum.toLocaleString()}円`])

    // UIntBArrayを生成
    const uintbarray = await workbook.xlsx.writeBuffer();
    //Blob生成
    const blob = new Blob([uintbarray], { type: 'application/octet-binary' });
    //DL用URLを生成し、aタグからダウンロードを実行
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${new Date().getMonth() + 1}月分.xlsx`;
    a.click();
    a.remove();
  };

  const handleDelete = (id) => {
    const _data = [...data];
    const copiedData = _data.filter((d) => d.id !== id);
    setData(copiedData);
    deleteData(id)
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Header/>
      <Box sx={{ flexGlow: 1, padding: '10px', height: '77vh'}}>
        <Grid container justifyContent='center'>
          <Grid item xs={5}>
            <Stack spacing={2}>
              <TextField
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Price"
                variant="outlined"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField 
                type="datetime-local"
                label="日付"
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <Button variant="contained" onClick={(e) => inputHandler(e)}>
                Add
              </Button>
              <Button
                variant="outlined"
                onClick={(e) => onClickExport(e, data)}>
                Convert to Excel
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={6} sx={{overflowY: 'scroll', maxHeight: '340px'}}>
            <List>
              {data.map((d) => (
                <ListItem key={d.id}>
                  <ListItemText
                    primary={`${d.title}: ${d.price}円`}
                    secondary={d.date}
                  />
                  <IconButton
                    onClick={() => {
                      setSum((prev) => prev - Number(d.price.replace(/,/, '')));
                      handleDelete(d.id);
                    }}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
            <TextField
              sx={{ marginTop: '20px', overflow: 'auto', marginLeft: '53px'}}
              label="合計金額"
              variant="filled"
              aria-readonly
              value={sum.toLocaleString()}
              InputProps={{
                endAdornment: <InputAdornment position="end">円</InputAdornment>,
              }}
              />
      </Box>
      <Snack open={open} onClose={handleClose} />
      <Footer />
    </LocalizationProvider>
  );
}

export default App;
