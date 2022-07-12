import axios from "axios";
import { useEffect, useState } from "react";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

const NewPhoto = () => {
  const [data, setData] = useState({});
  const [id, setId] = useState(1);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    let res = await axios.get("/data");
    setData(res.data);
  };
  const handleSubmit = async (e)=>{
      e.preventDefault()
      if(!files[0]){
        alert('you need to add a photo first')
        return
     }
      let formData = new FormData()
      formData.append('yyy', files[0].file)
      formData.append('desc', description)
      try{
        let res = await axios.post(`/yo/${id}`, formData)
        console.log(res)
        // res.data is the photo..
        setData({users: [...data.users], photos:[...data.photos, res.data]})
      } catch(err){
          alert('err')
          console.log(err)
      }
  }
  return (
    <div>
      <h1>New Photo</h1>
      <form onSubmit={handleSubmit}>
        <p>user id</p>
        <input value={id} onChange={(e) => setId(e.target.value)} />
        <p>description</p>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
        <p>image</p>
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          name="files"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
        <button>add</button>
      </form>
      <hr />
      <p>all data</p>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};
export default NewPhoto;
