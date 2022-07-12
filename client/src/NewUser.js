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
import { useState } from "react";
import axios from 'axios'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
const NewUser = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    // by doing we will be send file params and name param in our post req
    const data = new FormData()
    // specific to the case, here I'll say a photo is not needed for user
    if(files[0]){
      data.append('file', files[0].file)
    }
    data.append('name',name)
    try{
      let res = await axios.post('yo', data)
      console.log(res.data)
      // res.data is the user with name and image_url 
      // do whatever with this on the front end
    }catch(err){
        alert('err creating user')
        console.log(err)
    }

  };

  const handleUpdateFiles = (fileItems) => {
    // fileItems[0].file is how we grab the file
    // we'll setFiles to fileItems for now but
    // well use fileItems[0].file in our handsubmit
    console.log("fileItems:", fileItems[0].file);
    setFiles(fileItems)
  };
  return (
    <div>
      <h1>New User</h1>
      <form onSubmit={handleSubmit}>
        <p>Name</p>
        <input value={name} onChange={(e)=> setName(e.target.value)}/>
        <p>IMAGE UPLOADER</p>
        <FilePond
          files={files}
          onupdatefiles={handleUpdateFiles}
          allowMultiple={false}
          name="files"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
        <button>submit</button>
      </form>
    </div>
  );
};
export default NewUser;
