import fastify from 'fastify';
// see axios doc on how to use it

import axios from 'axios';
const app = fastify({ logger: true });
const catFactsurl = `https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=3`;

const loadCatFact = async () => {
  try {
    const { data } = await axios.get(catFactsurl);
    console.log(data);
    return data.map((item) => item.text);
  } catch (err) {
    console.log('\n' + err);
    return null;
  }
};

const loadDate = async (coutrycode) => {
  try {
    const { data } = await axios.get(
      `https://date.nager.at/api/v2/PublicHolidays/2021/${coutrycode}`,
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const loadImage = async () => {
  try {
    const {
      data: { image },
    } = await axios.get(`https://randomfox.ca/floof/`);
    console.log(image);
    return image;
  } catch (err) {
    console.log(err);
    return null;
  }
};

app.post('/', async (req, res) => {
  let coutrycode = req.body?.countryCode;

  console.log(coutrycode);
  const [foxPicture, catFacts, holidays] = await Promise.all([
    loadImage(),
    loadCatFact(),
    loadDate(coutrycode),
  ]);
  return {
    foxPicture,
    catFacts,
    holidays,
  };
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
