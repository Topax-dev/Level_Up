export const response = (status_code, datas, message, res) => {
  return res.status(status_code).json([
    {
      status_code,
      payload: datas,
      message,
    },
  ]);
};
