class TacosController < ApplicationController

    def get_data
      render json: {users: User.all, photos:Photo.all}
    end

    def new_user
        # getting file from client
        file = params[:file]
        name = params[:name]
        begin
            # save imagine to cloudinary if client gave us one
            if file
              cloud_image = Cloudinary::Uploader.upload(file, public_id: file.original_filename, secure: true, resource_type: :auto)
            end
            image_url =  cloud_image ? cloud_image["secure_url"] : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0='
            # succesfull saved to cloudinary add to db
            user = User.new(image_url: image_url  , name: name)
            if(user.save)
                # we success create user to our db
                render json: user
            else
                # we unsuccessfully create user to our db
                render json: {errors: user.errors.full_messages}, status: 422
            end
        
        rescue => e
            # if this is unsucessfully saved to cloudinary than we will come here
            # and e will give us an idea about why it didn't
            render json: {errors: e}, status: 400
        end
    end

 
    def new_photo
        # bad names here for demo
      user = User.find(params[:mustard])
      file = params[:yyy]

      # here we do need a file
      if(!file)
        render json: {error: 'no photo provided'}, status: 422
        return
      end

      begin
        # save to cloudinary
        cloud_image = Cloudinary::Uploader.upload(file, public_id: file.original_filename, secure: true, resource_type: :auto)
        #if successfull do DB
        photo = user.photos.new(description:params[:desc], image_url:cloud_image["secure_url"] )
        if(photo.save)
            render json: photo
        else
            render json: {error: photo.errors.full_messages}, status: 422
        end
       rescue => e
            render json: {error: e}, status: 400
       end
    end
end
