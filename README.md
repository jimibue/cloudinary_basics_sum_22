```
$ rails new image_upload_review -d postgresql --api
$ cd image_upload_review
$ yarn create react-app client
```

(Unrealted to image upload, minus storing the URL in our db)
## Models
```
rails g model user name image_url 
rails g model photo description image_url user:belongs_to
```

## Controller (unconventional)
```
rails g controller tacos
```

##Rails setup for image upload

1. create .env file (add our keys from cloudinary to our project (authenticate))
   * add .env to .gitignore and add .env.example to show other user what keys they need

   .env
   ```
   CLOUD_NAME=valuefromcloudianary
   API_KEY=valuefromcloudianary
   API_SECRET=valuefromcloudianary
   ```

2. GEMS
    cloudinary - so we can interact cloudinary
    dotenv-rails - .env and makes those var ascessable through our app

    ```ruby
    gem 'cloudinary'

    group :development, :test do
       gem 'dotenv-rails'
    end
    ```
3. add config/cloudinary.yml file to rails project  

```ruby
development:
  cloud_name: <%= ENV['CLOUD_NAME'] %>
  api_key: <%= ENV['API_KEY'] %>
  api_secret: <%= ENV['API_SECRET'] %>
production:
  cloud_name: <%= ENV['CLOUD_NAME'] %>
  api_key: <%= ENV['API_KEY'] %>
  api_secret: <%= ENV['API_SECRET'] %>
test:
  cloud_name: <%= ENV['CLOUD_NAME'] %>
  api_key: <%= ENV['API_KEY'] %>
  api_secret: <%= ENV['API_SECRET'] %>
```

* reminders
  - bundle after adding gems
  - rails db:migrate after adding models
  - restart server after adding adding config/cloudinary.yml, and upadate .env file, adding gems


### usage of cloudinary in rails

```ruby

# getting file from client
file = somehowgetfilefromclient might be (params[:file])
begin
  cloud_image = Cloudinary::Uploader.upload(file, public_id: file.original_filename, secure: true, resource_type: :auto)
  # if succesfull
  cloud_image[":secure_url"] # this link to the url..

  # so you at this point have the url to image stored in cloudinary do whatever you want with it
  # is probably going to be stroing in your own db
 
rescue => e
  # if this is unsucessfully saved to cloudinary than we will come here
  # and e will give us an idea about why it didn't
end
```

# FRONT END

## we have choosen to use filepond: a little harder but has more functional

add filepond
```
yarn add filepond react-filepond filepond-plugin-image-exif-orientation filepond-plugin-image-preview
```

### adding a image in a form

```javascript
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
```
