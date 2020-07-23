export async function handleRequest(request: Request): Promise<Response> {

  let requestType: string = request.method;
  let responseObj: any;

  if (requestType === "GET") {
    responseObj = getQueryParams(request.url);
  }
  else if (requestType === "POST") {
    responseObj = await readRequestBody(request);
  }
  else {
    responseObj = JSON.stringify(request);
  }

  return new Response(responseObj, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
  })
}

function getQueryParams(url: string) {
  let queryParams: any = {}

  let queryString = url.split('?');
  let queryPairs: string[] = [];
  queryString.forEach(item => {
    item.split('&').forEach(item => {
      queryPairs.push(item);
    })
  })

  queryPairs.forEach(item => {
    let keyValueArray = item.split('=');
    queryParams[keyValueArray[0]] = keyValueArray[1];
  });

  return JSON.stringify(queryParams);
};

async function readRequestBody(request: Request) {
  let { headers } = request;
  let contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return JSON.stringify(await request.json());
  }
  else if (contentType.includes('application/text')) {
    return await request.text();
  }
  else if (contentType.includes('text/html')) {
    return await request.text();
  }
  else if (contentType.includes('form')) {
    let formData = await request.formData();
    let body: any = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    })
    return JSON.stringify(body);
  }
  else {
    let myBlob = await request.blob();
    let objectURL = URL.createObjectURL(myBlob);
    return objectURL;
  }
}

