import './App.css';
import ExcelJS from 'exceljs';
import { v4 as uuid } from 'uuid';
import { useState } from 'react';
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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import Snack from './components/Snack';

function App() {
  const [name, setName] = useState('');
  const [date, setDate] = useState(
    moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  );
  const [price, setPrice] = useState('');
  const [data, setData] = useState([]);
  const [sum, setSum] = useState(0);
  const [open, setOpen] = useState(false);

  const handleChange = (newValue) => {
    setDate(newValue);
  };

  const inputHandler = (e) => {
    e.preventDefault();
    if (name === '' || date === '' || price === '') {
      setOpen(true);
      return;
    }
    const dataObj = {
      id: uuid(),
      name: name,
      date: date,
      price: Number(price).toLocaleString(),
    };
    const newData = [...data, dataObj];
    console.log(newData);
    setData(newData);
    setSum((prev) => prev + Number(price));
    setName('');
    setDate(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    setPrice('');
  };

  const onClickExport = async (e, data) => {
    e.preventDefault();

    // Workbookのインスタンス
    const workbook = new ExcelJS.Workbook();
    // Workbookに新しいWorksheetを追加
    workbook.addWorksheet('Mysheet');
    const worksheet = workbook.getWorksheet('Mysheet');

    //列を定義
    worksheet.columns = [
      { header: '名前', key: 'name' },
      { header: '日付', key: 'date' },
      { header: '金額', key: 'price' },
    ];

    //行を定義
    data.forEach((data) => worksheet.addRow(data));

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
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ flexGlow: 1, padding: '10px' }}>
        <Grid container>
          <Grid item xs={5}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Price"
                variant="outlined"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <DateTimePicker
                label="日付"
                value={date}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button variant="contained" onClick={(e) => inputHandler(e)}>
                Add
              </Button>
              <Button
                variant="outlined"
                onClick={(e) => onClickExport(e, data)}>
                Excel
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <List>
              {data.map((d) => (
                <ListItem key={d.id}>
                  <ListItemText
                    primary={`${d.name}: ${d.price}円`}
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
          sx={{ marginTop: '20px' }}
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
    </LocalizationProvider>
  );
}

export default App;
