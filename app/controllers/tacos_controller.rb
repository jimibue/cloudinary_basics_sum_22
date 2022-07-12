class TacosController < ApplicationController

    def new_user
        binding.pry
        # getting file from client
        file = params[:file]
        name = params[:name]
        begin
            # save imagine to cloudinary
            cloud_image = Cloudinary::Uploader.upload(file, public_id: file.original_filename, secure: true, resource_type: :auto)
            # succesfull saved to cloudinary add to db
            user = User.new(user_params)
            user.image_url = cloud_image[":secure_url"]
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
            render json: {errors: e}, status: 422
        end
    end

    private

    def user_params
       params.require(:user).permit(:name)
    end
end
