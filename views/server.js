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
  const members = await dbMembers.find({}).toArray()
  const clubMember = await dbMembers.findOne({ _id: ObjectId(req.params.id) });
  res.render('member', {
    members,
    clubMember,
  });
});

app.get('/add', (req, res) => {
  res.render('add');
});


app.get('/members/sort/1', async (req, res) => {
  const members = await dbMembers.find({}).sort({name: 1}).toArray();
  res.render('members', {
    members
  })
})
app.get('/members/sort/2', async (req, res) => {
  const members = await dbMembers.find({}).sort({name: -1}).toArray();
  res.render('members', {
    members
  })
})


app.post('/member/update/:id', async (req, res) => {
  console.log(req.body);
  await dbMembers.updateOne({ _id: ObjectId(req.params.id)}, {$set: {...req.body}});
  res.redirect('/members');
})


app.post('/member/add', async (req, res) => {
  await dbMembers.insertOne({
   ...req.body,
    createdAt: new Date()
  })
  res.redirect("/members");
})

app.get('/member/:id/delete', async (req, res) => {
  const delMember = await dbMembers.findOne({ _id: ObjectId(req.params.id) });

  db.dbMembers.deleteOne(delMember);
  res.redirect('/members');
})


app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})