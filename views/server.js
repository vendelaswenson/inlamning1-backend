import { MongoClient, ObjectId } from 'mongodb';
import express from 'express';

const port = 8000;
const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static('./views'));

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const foodclub = client.db('foodclub');
const dbMembers = foodclub.collection('member');

app.get('/start', (req, res) => {
  res.render('start');
});

app.get('/members', async(req, res) => {
  const members = await dbMembers.find({}).toArray();
  res.render('members', {
    members,
  });
});

app.get('/member/:id', async (req, res) => {
  const clubMember = await dbMembers.findOne({ _id: ObjectId(req.params.id) });
  res.render('member', {
    clubMember
  });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/member/add', async (req, res) => {
  await dbMembers.insertOne({
   ...req.body,
    createdAt: new Date()
  })
  res.redirect("/members");
})

app.get('/member/:id/delete', async (req, res) => {
  const delMember = await dbMembers.findOne({ _id: ObjectId(req.params.id) });

  dbMembers.deleteOne(delMember);
  res.redirect('/members');
})


app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})