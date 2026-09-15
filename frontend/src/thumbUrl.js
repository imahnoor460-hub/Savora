// Dish images are full-size Cloudinary uploads (one is a 2.6 MB PNG). The small
// round thumbnails beside each dish ask Cloudinary for a cropped, compressed
// copy instead. Anything that is not a Cloudinary upload URL is returned as is.
export function thumbUrl(url, size = 160) {
  if (!url || !url.includes("/image/upload/")) return url;
  return url.replace(
    "/image/upload/",
    `/image/upload/c_fill,w_${size},h_${size},f_auto,q_auto/`
  );
}
