const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

try {
  const attributes = core.getInput('attributes');
  const workSpaceName = core.getInput('workSpaceName');
  const organizationName = core.getInput('organizationName');
  const token = core.getInput('token')
  
  console.log(`Input ${attributes}`);
  console.log(`workSpaceName ${workSpaceName}`);
  console.log(`organizationName ${organizationName}`);
  const options = {
    headers: {'Content-Type': 'application/vnd.api+json',
              'Authorization': `Basic ${token}`}
  };
  const url = "https://app.terraform.io/api/v2/vars?filter%5Borganization%5D%5Bname%5D=${ organizationName }&filter%5Bworkspace%5D%5Bname%5D=${ workSpaceName}";
  console.log("url:"+url);

// Loop through attribute and Invoke API
  for(attribute in attributes){
    console.log("attribute:"=attribute);
    var req = {};
    req.data = {};
    req.data.type = "vars";
    req.data.attribute = JSON.parse(attributes);
    console.log(`Request ${req}`);
    var output = "Success";
    // Invoke 
    axios.post(url, req)
      .then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
        output = error;
        break;
      });

  }
  core.setOutput("output", output); 
} catch (error) {
  core.setFailed(error.message);
}