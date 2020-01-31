const { masterApiUrl, credentials: {email, password}, data } = require('./data/data.json');
const RandomGeneratorService = require('./libs/randomGeneratorService');
const randomWordGeneratorService = new RandomGeneratorService();
const axios = require('axios');
const Sha1 = require('./libs/hash');


const salt = randomWordGeneratorService.create();
const token = `User ${email} ${Sha1.hash(salt + "+" + Sha1.guid(password), true, true)}`;


axios.defaults.headers.common['Authorization'] = token;
axios.defaults.headers.common['X-Salt'] = salt;
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.70 Safari/537.36';
axios.defaults.headers.common['Content-Type'] = 'application/json';




const isCredsValid = () => axios.get(`${masterApiUrl}auth`);

const parseDataPart = () => {
  const res = [];
  data.forEach(ruleSet => {
    ruleSet.nodeIds.forEach(id => {
     ruleSet.rules.forEach(rule => {
       res.push({
         rule: {
          ...rule,
          nodeId: id
         },
         envId: ruleSet.environmentId
       })
     })
    })
  });
  return res;
};

const splitBy = (arr, split) => {
	const res = [];
  let itemsQuantity = Math.ceil(arr.length / split);
  while(itemsQuantity) {
  	itemsQuantity--;
    res.push(arr.splice(0, split))
  }
  return res;
};

const saveChanges = async () => {
  try{
    await isCredsValid()
  } catch(e) {
    return;
  }

  const requestGroups = splitBy(parseDataPart(), 20);
  try{
    requestGroups.forEach(async (requests) => {
      const result = await Promise.all(
        requests
          .map(({envId, rule}) => axios
            .post(`${masterApiUrl}environments/${envId}/customCorridors`, rule)
            .catch(e => console.log(`can't create envId: ${envId}, rule: ${JSON.stringify(rule)}`)))
      )
    })
  }catch(err){
    console.log(err);
    return;
  }
  console.log('done!')
};

saveChanges();
