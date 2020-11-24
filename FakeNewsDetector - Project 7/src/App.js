import './App.css';
import {useState, useEffect} from "react";

function App() {
  const [articleTitle, setArticleTitle] = useState("");
  const [videos, setVideos] = useState(0);
  const [images, setImages] = useState(0);
  const [weekday, setWeekday] = useState("0");
  const [articleOriginator, setArticleOriginator] = useState("");
  const [articleText, setArticleText] = useState("");
  const [opColor, setOpColor] = useState("orange")
  const [popularity, setPopularity] = useState("");
  const [fake, setFake] = useState(true);
  const [listData, setListData] = useState([])
  const [showUI, setShowUI] = useState(false);
  const [showCols, setShowCols] = useState(false);
  let listItems;
  require('../node_modules/aws-sdk/clients/sagemakerruntime')
  let AWS = require('aws-sdk')
  AWS.config.region = 'us-east-2'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-2:0df5daf5-a9af-4775-a685-b926cb2f77a9',
  });
  const jsonString = '{"pipeline_index": 0, "input_data": {"title": \"' + articleTitle + '\", "author": \"'
    + articleOriginator + '\", "text": \"' + articleText + '\"}}'

  const params = {
    Body: new Buffer(jsonString),
    EndpointName: 'eecs-731-newer',
    ContentType: 'application/json'
  };

  const sageMakerRuntime = new AWS.SageMakerRuntime({'region': 'us-east-2'})

  const validateColor = (isFake) => {
    if (isFake) {
      setOpColor("red")
    }
    else {
      setOpColor("green")
    }
  }
  const validateNews = async () => {
    console.log("These are the news article params to validate \n ", articleTitle, "\n", articleOriginator, "\n",
      articleText);
    //setShowCols(true);

    // listItems = listData.map((d, index) => <li key={index}>{d.Title}</li>);
    // setListData([{"Title":"Hell0123"},{"Title":"Hell0456"}])
    // console.log(listItems)

    await sageMakerRuntime.invokeEndpoint(params, function (err, data) {
      setShowUI(true);
      if (err) {
        //setFake(false);
        //setPopularity("Very Popular")
        //validateColor(false)
      }
      else {
        const responseData = JSON.parse(Buffer.from(data.Body).toString('utf8'))
        if (responseData) {
          setFake(responseData.prediction[0] == 0 ? false : true);
          //setPopularity("Very Popular")
          validateColor(responseData.prediction[0] == 0 ? false : true)

        }
      }
    });

  }
  return (
    <div className={"bgImage"}>
      <div className={"divlayout"}
           style={{display: "grid", 'grid-template-columns': '600px 500px 500px', gridGap: 100, top: '180%'}}>
        <div>
          <form>
            <div>
              <h3 style={{"font-family": "Times"}}>
                Article Title
              </h3>
              <textarea className={"text_area"} cols={35} rows={5} value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}/>
            </div>
            <div>
              <h3 style={{"font-family": "Times"}}> Article Author
              </h3>
              <textarea className={"text_area"} cols={35} rows={1}
                        onChange={(e) => setArticleOriginator(e.target.value)}/>
            </div>
            <div>
              <h3 style={{"font-family": "Times"}}>
                Article Text
              </h3>
              <textarea className={"text_area"} cols={35} rows={5} onChange={(e) => setArticleText(e.target.value)}/>
            </div>
            <h3>   </h3>

            {1==2 && <div>
              <h3 style={{"font-family": "Times"}}>
                Number of Videos
              </h3>
              <textarea className={"text_area"} rows={1} onChange={(e) => setVideos(e.target.value)}/>
            </div>}

            {1==2 && <div>
              <h3 style={{"font-family": "Times"}}>
                Number of Images
              </h3>
              <textarea className={"text_area"} rows={1} onChange={(e) => setImages(e.target.value)}/>
            </div>}
            {1==2 && <div>
              <h3 style={{"font-family": "Times"}}>
                Pick a weekday:
                <select className={"text_area"} onChange={(e) => setWeekday(e.target.value)}>
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                </select>
              </h3>
            </div>}

          </form>
          <button class="buttonBG" style={{"background-color": opColor}}
                  onClick={validateNews} disabled={!articleTitle}>
            <h1>Let's Break the Fake !</h1>
          </button>
        </div>
        {showUI && <div className={"column_text_area"} style={{"font-family": "Times", "color": opColor}}>
          {showCols && popularity &&<p>
            This news article is {popularity}
          </p>}
          {<p>
            This news article is {fake ? "Fake" : "not fake"}
          </p>}
        </div>}
        {showUI && showCols && <div className={"column_text_area"} style={{"font-family": "Times"}}>
          {showCols && <p>
            Here are a few suggested news articles:
          </p>}
          {listData.map((d, index) => <p>{index + 1}. {d.Title}</p>)}
          <p>The selected week day is {weekday}</p>
        </div>}
      </div>


    </div>
  );
}

export default App;
