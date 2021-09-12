```js
const [open, setOpen] = React.useState(false);
const OpenDialog = () => setOpen(true);

const onCancel = () => {
  console.log('@cancel');
  setOpen(false);
};

const onSubmit = (data) => {
  console.log('@data', data);
};
<>
  <DocumentCreateDialog open={open} onCancel={onCancel} onSubmit={onSubmit} />
  <button onClick={OpenDialog}>Open Dialog</button>
</>;
```
