import React from "react";
function Blog() {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 pt-64">
        {/* Header section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Book Heaven Blog</h1>
          <p className="text-lg text-gray-600">Explore the world of books!</p>
        </header>

        {/* Blog posts section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example blog post card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <img
              src="https://pbs.twimg.com/profile_banners/46475424/1680696970/1500x500"
              alt="Book Cover"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              harry potter
            </h2>
            <p className="text-sm text-gray-600 mb-4">Author Name</p>
            <p className="text-gray-700">
              Brief description of the blog post or book.
            </p>
            <a
              href="#"
              className="text-blue-600 font-semibold hover:underline inline-block mt-2"
            >
              Read more
            </a>
          </div>

          {/* Repeat this card structure for multiple blog posts */}
        </section>
        
      </div>
      <div className="container mx-auto px-4 pt-64">
        {/* Header section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Book Heaven Blog</h1>
          <p className="text-lg text-gray-600">Explore the world of books!</p>
        </header>

        {/* Blog posts section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example blog post card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <img
              src="https://pbs.twimg.com/profile_banners/46475424/1680696970/1500x500"
              alt="Book Cover"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              harry potter
            </h2>
            <p className="text-sm text-gray-600 mb-4">Author Name</p>
            <p className="text-gray-700">
              Brief description of the blog post or book.
            </p>
            <a
              href="#"
              className="text-blue-600 font-semibold hover:underline inline-block mt-2"
            >
              Read more
            </a>
          </div>

          {/* Repeat this card structure for multiple blog posts */}
        </section>
      </div>
    </div>
  );
}

export default Blog;