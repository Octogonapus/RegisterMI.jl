var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = MutualInformationImageRegistration","category":"page"},{"location":"#MutualInformationImageRegistration","page":"Home","title":"MutualInformationImageRegistration","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for MutualInformationImageRegistration.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [MutualInformationImageRegistration]","category":"page"},{"location":"#MutualInformationImageRegistration.MutualInformationImageRegistration","page":"Home","title":"MutualInformationImageRegistration.MutualInformationImageRegistration","text":"MutualInformationImageRegistration performs image registration using mutual information.\n\nHere's a complete example on how to use this package:\n\nusing MutualInformationImageRegistration, MutualInformationImageRegistration.FastHistograms, Random\n\n# Create the container used to hold intermediate variables for registration\nmi = MutualInformationContainer(\n    create_fast_histogram(\n        FastHistograms.FixedWidth(),\n        FastHistograms.Arithmetic(),\n        FastHistograms.NoParallelization(),\n        [(0x00, 0xff, 4), (0x00, 0xff, 4)],\n    ),\n)\n\n# Create the full image that the smaller images to register will be pulled from\nfull_image = rand(UInt8, 500, 300)\nview(full_image, 300:330, 200:220) .= 0xff\n\n# The fixed image is the image that the other images are registered against\nfixed = full_image[(300-10):(330+10), (200-10):(220+10)]\n\n# The max shift is the maximum search range\nMAX_SHIFT = 11\n# Padding is used to grow the bbox for higher quality registration\npadding = [-10, -10, 10, 10]\n\n# A buffer is needed to hold intermediate data\nbuffer = Array{UInt8}(undef, (size(fixed) .+ (MAX_SHIFT * 2))...)\n\n# Introduce a random shift to the moving bbox\nexpected_x = rand(-5:5)\nexpected_y = rand(-5:5)\n\n# Register the image given by the bbox (called the moving bbox) against the fixed image\nshift, mm, mms = register!(\n    mi,\n    full_image,\n    fixed,\n    [300, 200, 330, 220] .+ padding .+ [expected_x, expected_y, expected_x, expected_y],\n    MAX_SHIFT,\n    MAX_SHIFT,\n    buffer,\n)\n\n# The shift we get out should be equal and opposite of the shift we applied\nshift == (-expected_x, -expected_y)\n\n# output\n\ntrue\n\nAlso look at the non-exported traits NoParallelization and SIMD, which can be used when constructing a MutualInformationContainer. NoParallelization is the default; other traits can be used to customize how the mutual information computation is run.\n\n\n\n\n\n","category":"module"},{"location":"#MutualInformationImageRegistration.MutualInformationParallelization","page":"Home","title":"MutualInformationImageRegistration.MutualInformationParallelization","text":"A trait for the ways the mutual information calculation can be parallelized.\n\n\n\n\n\n","category":"type"},{"location":"#MutualInformationImageRegistration.NoParallelization","page":"Home","title":"MutualInformationImageRegistration.NoParallelization","text":"No threading nor vectorization.\n\n\n\n\n\n","category":"type"},{"location":"#MutualInformationImageRegistration.SIMD","page":"Home","title":"MutualInformationImageRegistration.SIMD","text":"SIMD vectorization.\n\n\n\n\n\n","category":"type"},{"location":"#MutualInformationImageRegistration._mutual_information!-Tuple{MutualInformationContainer}","page":"Home","title":"MutualInformationImageRegistration._mutual_information!","text":"Compute the MI. The hist inside mi must already be incremeted.\n\n\n\n\n\n","category":"method"},{"location":"#MutualInformationImageRegistration.mutual_information!-Tuple{MutualInformationContainer, Any, Any, Any, Any, Any, Any, AbstractMatrix{Float32}}","page":"Home","title":"MutualInformationImageRegistration.mutual_information!","text":"mutual_information!(\n    mi::MutualInformationContainer,\n    fixed,\n    buffer,\n    ::Any,\n    moving_bbox,\n    range_x,\n    range_y,\n    prev_mis::AbstractArray{Float32,2};\n    get_buffer_crop,\n    kwargs...\n)\n\nCalculates the mutual information of two images at all shifts within the range_x and range_y. Warm-starts the evaluation using previous results (prev_mis; the return value from a previous call of this function) and using the previously set and filtered contents of the buffer.\n\n\n\n\n\n","category":"method"},{"location":"#MutualInformationImageRegistration.mutual_information!-Tuple{MutualInformationContainer, Any, Any, Any, Any, Any, Any, Missing}","page":"Home","title":"MutualInformationImageRegistration.mutual_information!","text":"mutual_information!(\n    mi::MutualInformationContainer,\n    fixed,\n    buffer,\n    full_image,\n    moving_bbox,\n    range_x,\n    range_y,\n    ::Missing;\n    set_buffer!,\n    get_buffer_crop,\n    prefilter_frame_crop! = x -> nothing,\n)\n\nCalculates the mutual information of two images at all shifts within the range_x and range_y. The fixed image must already be filtered. This will set the buffer and filter its contents using prefilter_frame_crop!.\n\n\n\n\n\n","category":"method"},{"location":"#MutualInformationImageRegistration.mutual_information!-Tuple{MutualInformationContainer, Any, Any}","page":"Home","title":"MutualInformationImageRegistration.mutual_information!","text":"mutual_information!(mi::MutualInformationContainer, x, y)\n\nComputes the mutual information between the two variables x and y. The histogram within mi must be of the correct type to handle the formats of x and y.\n\n\n\n\n\n","category":"method"},{"location":"#MutualInformationImageRegistration.register!-Union{Tuple{T}, Tuple{MutualInformationContainer, AbstractMatrix{T}, AbstractMatrix{T}, AbstractVector{Int64}, AbstractVector{Int64}, AbstractVector{Int64}, AbstractMatrix{T}, Union{Missing, AbstractMatrix{Float32}}}} where T<:Integer","page":"Home","title":"MutualInformationImageRegistration.register!","text":"register!(\n    mi::MutualInformationContainer,\n    full_image::AbstractArray{T,2},\n    fixed::AbstractArray{T,2},\n    moving_bbox::AbstractVector{Int},\n    range_x::AbstractVector{Int},\n    range_y::AbstractVector{Int},\n    buffer::AbstractArray{T,2},\n    prev_mis::Union{Missing,AbstractArray{Float32,2}};\n    set_buffer! = (buffer, current_frame, moving_bbox) -> set_buffer!(buffer, current_frame, moving_bbox, maximum(range_x), maximum(range_y)),\n    get_buffer_crop = (buffer, moving_bbox, shift_x, shift_y) -> get_buffer_crop(buffer, moving_bbox, shift_x, shift_y, maximum(range_x), maximum(range_y)),\n    prefilter_frame_crop! = x -> nothing,\n) where {T<:Integer}\n\nCalculates the shift that best aligns the moving_bbox to the fixed image within the full_image. At a high level, this attempts to best match the view of moving_bbox inside full_image to the fixed image. This only considers shifts along the x and y axes; no rotation is considered. All combinations of shifts within range_x and range_y are considered.\n\nAdding some padding to moving_bbox is a good idea to improve registration stability. E.g. my_bbox .+ [-10, -10, 10, 10]. You will need to determine the best padding value for your data.\n\nThe parameter buffer is required for temporary storage between calls to this function because it is assumed that you will call this function in a loop to register many similar images. Generally, you can define buffer as Array{T}(undef, (size(fixed) .+ (MAX_SHIFT * 2))...). The buffer must have a size which is at least the size of the fixed image expanded by the maximum and minimum x and y shifts on each respective axis. The parameters set_buffer! and get_buffer_crop are used to write to and read from this buffer, respectively. There is typically no need to change these from their defaults.\n\nThe parameter prev_mis is used to memoize the mutual information calculations if this function is being called \"incrementally\" with an expanding shift horizon. If you are calling this function directly (and not in a loop to gradually expand a maximum shift horizon), you should set this to missing, which would cause all combinations of shifts within range_x and range_y to be considered.\n\nThe parameter prefilter_frame_crop! can be specified if you want to apply image filtering before computing the mutual information between the two images. This function must mutate the image it is given with whatever filtering operation you implement. Also, the fixed image must have the filtering pre-applied. See this package's tests for an example.\n\n\n\n\n\n","category":"method"},{"location":"#MutualInformationImageRegistration.register!-Union{Tuple{T}, Tuple{MutualInformationContainer, AbstractMatrix{T}, AbstractMatrix{T}, AbstractVector{Int64}, Int64, Int64, AbstractMatrix{T}}} where T<:Integer","page":"Home","title":"MutualInformationImageRegistration.register!","text":"register!(\n    mi::MutualInformationContainer,\n    full_image::AbstractArray{T,2},\n    fixed::AbstractArray{T,2},\n    moving_bbox::AbstractVector{Int},\n    max_shift_x::Int,\n    max_shift_y::Int,\n    buffer::AbstractArray{T,2};\n    set_buffer! = (buffer, current_frame, moving_bbox) -> set_buffer!(buffer, current_frame, moving_bbox, max_shift_x, max_shift_y),\n    get_buffer_crop = (buffer, moving_bbox, shift_x, shift_y) -> get_buffer_crop(buffer, moving_bbox, shift_x, shift_y, max_shift_x, max_shift_y),\n    prefilter_frame_crop! = x -> nothing,\n    start_shift_x = 3,\n    start_shift_y = 3,\n    expand_border = 1,\n    expand_increment = 1,\n) where {T<:Integer}\n\nCalculates the shift that best aligns the moving_bbox to the fixed image within the full_image. At a high level, this attempts to best match the view of moving_bbox inside full_image to the fixed image. This only considers shifts along the x and y axes; no rotation is considered. This function incrementally expands the maximum shift horizon to evaluate as few shifts as possible. At a minimum, all shifts within ± start_shift_x and ± start_shift_y are considered. If the optimal shift falls within expand_border of the horizon, the horizon will be expanded by expand_increment and all new shifts will be evaluated. This process repeats until the optimal shift does not fall within expand_border of the horizon, or until the horizon has reached max_shift_x and max_shift_y.\n\nAdding some padding to moving_bbox is a good idea to improve registration stability. E.g. my_bbox .+ [-10, -10, 10, 10]. You will need to determine the best padding value for your data.\n\nThe parameter buffer is required for temporary storage. Generally, you can define buffer as Array{T}(undef, (size(fixed) .+ (MAX_SHIFT * 2))...). The buffer must have a size which is at least the size of the fixed image expanded by the maximum and minimum x and y shifts on each respective axis. The parameters set_buffer! and get_buffer_crop are used to write to and read from this buffer, respectively. There is typically no need to change these from their defaults.\n\nThe parameter prefilter_frame_crop! can be specified if you want to apply image filtering before computing the mutual information between the two images. This function must mutate the image it is given with whatever filtering operation you implement. Also, the fixed image must have the filtering pre-applied. See this package's tests for an example.\n\n\n\n\n\n","category":"method"}]
}
