// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import data from '../../../public/Data.json'
export default function handler(req, res) {
  res.status(200).json(data);
}
