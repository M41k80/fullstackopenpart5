const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy function', () => {
  test('dummy returns one', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total Likes ', () => {
    const listWithOneBlog = [
        { 
            _id: '5a422aa71b54a676234d17f8', 
            title: 'Go To Statement Considered Harmful', 
            author: 'Edsger W. Dijkstra', 
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf', likes: 5, __v: 0 
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        console.log('listWithOneBlog', listWithOneBlog)
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    const listWithMultipleBlogs = [
         { _id: '5a422aa71b54a676234d17f8', 
            title: 'Go To Statement Considered Harmful', 
            author: 'Edsger W. Dijkstra', 
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf', likes: 5, __v: 0 
        }, 
         { _id: '5a422aa71b54a676234d17f9', 
            title: 'A second blog', 
            author: 'Another Author', 
            url: 'https://example.com', 
            likes: 3, __v: 0 
        }, 
         { _id: '5a422aa71b54a676234d18f0', 
            title: 'A third blog', 
            author: 'Third Author', 
            url: 'https://example.com', 
            likes: 2, __v: 0 
        } 
    ]
    test('when list has multiple blogs, sums the likes of all blogs', () => {
        console.log('listWithMultipleBlogs', listWithMultipleBlogs)
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        assert.strictEqual(result, 10)
    })

    const emptyList = []

    test('when list is empty, equals zero', () => {
        const result = listHelper.totalLikes(emptyList)
        assert.strictEqual(result, 0)
    })

})

describe('favorite blog', () => {
    const listWithMultipleBlogs = [
        { 
            _id: '5a422aa71b54a676234d17f8', 
            title: 'Go To Statement Considered Harmful', 
            author: 'Edsger W. Dijkstra', 
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf', likes: 5, __v: 0 

        },
        { 
            _id: '5a422aa71b54a676234d17f9', 
            title: 'Canonical string reduction', 
            author: 'Edsger W. Dijkstra', 
            url: 'https://example.com', 
            likes: 12, __v: 0 
        }, 
        { 
            _id: '5a422aa71b54a676234d18f0', 
            title: 'A third blog', 
            author: 'Third Author', 
            url: 'https://example.com', 
            likes: 2, __v: 0 
        }
    ]
    test('returns the blog with the most likes', () => {
        const result = listHelper.favortiteBlogs(listWithMultipleBlogs)
        assert.deepStrictEqual(result, {
            _id: '5a422aa71b54a676234d17f9', 
            title: 'Canonical string reduction', 
            author: 'Edsger W. Dijkstra', 
            url: 'https://example.com', 
            likes: 12, __v: 0
        })
    })

    const emptyList = []

    test('when list is empty, returns null', () => {
        const result = listHelper.favortiteBlogs(emptyList)
        assert.strictEqual(result, null)
    })
    

})

describe('mostBlogs', () => {
    const listWithMultipleBlogs = [
    { 
        _id: '5a422aa71b54a676234d17f8', 
        title: 'Go To Statement Considered Harmful', 
        author: 'Edsger W. Dijkstra', 
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf', 
        likes: 5, __v: 0 

    },
    { 
        _id: '5a422aa71b54a676234d17f9', 
        title: 'Canonical string reduction', 
        author: 'Edsger W. Dijkstra', 
        url: 'https://example.com', 
        likes: 12, __v: 0 
    }, 
    { 
        _id: '5a422aa71b54a676234d18f0', 
        title: 'A third blog', 
        author: 'Third Author', 
        url: 'https://example.com', 
        likes: 2, __v: 0 
    },
    { 
        _id: '5a422aa71b54a676234d18f1', 
        title: 'A Fourth blog',
        author: 'Third Author', 
        url: 'https://example.com', 
        likes: 6, __v: 0
    
    },
    { 
        _id: '5a422aa71b54a676234d', 
        title: 'A Fifth blog',
        author: 'Third Author', 
        url: 'https://example.com',
        likes: 1, __v: 0 
    },
    ]
  
    test('returns author with most blogs', () => {
      const result = listHelper.mostBlogs(listWithMultipleBlogs)
      assert.deepStrictEqual(result, { author: 'Third Author', blogs: 3 })
      console.log('Author with most blogs:', result)
    })

    const emptyList = []

    test('when list is empty, returns null', () => {
        const result = listHelper.mostBlogs(emptyList)
        assert.strictEqual(result, null)
    })
})



describe('mostLikes', () => {
    const listWithMultipleBlogs = [
        { 
            _id: '5a422aa71b54a676234d17f8', 
            title: 'Go To Statement Considered Harmful', 
            author: 'Edsger W. Dijkstra', 
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf', 
            likes: 5, __v: 0 
        },
        { 
            _id: '5a422aa71b54a676234d17f9', 
            title: 'Canonical string reduction', 
            author: 'Edsger W. Dijkstra', 
            url: 'https://example.com', 
            likes: 12, __v: 0 
        }, 
        { 
            _id: '5a422aa71b54a676234d18f0', 
            title: 'A third blog', 
            author: 'Third Author', 
            url: 'https://example.com', 
            likes: 2, __v: 0 
        },
        { 
            _id: '5a422aa71b54a676234d18f1', 
            title: 'A Fourth blog',
            author: 'Third Author', 
            url: 'https://example.com', 
            likes: 6, __v: 0
        
        },
        { 
            _id: '5a422aa71b54a676234d', 
            title: 'A Fifth blog',
            author: 'Third Author', 
            url: 'https://example.com',
            likes: 1, __v: 0 
        },
    ]

    test('returns author with most likes', () => {
      const result = listHelper.mostLikes(listWithMultipleBlogs)
      assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
      console.log('Author with most likes:', result)
    })

    const emptyList = []

    test('when list is empty, returns null', () => {
        const result = listHelper.mostLikes(emptyList)
        assert.strictEqual(result, null)
    })

})




  // test('returns correct author when there are ties', () => {
    //   const result = listHelper.mostBlogs([
    //     { 
    //         _id: '1', 
    //         title: 'Blog 1', 
    //         author: 'Author A', 
    //         url: 'http://example.com', 
    //         likes: 2 
    //     },
    //     { 
    //         _id: '2', 
    //         title: 'Blog 2', 
    //         author: 'Author B', 
    //         url: 'http://example.com', 
    //         likes: 5 
    //     },
    //     { 
    //         _id: '3', 
    //         title: 'Blog 3', 
    //         author: 'Author B', 
    //         url: 'http://example.com', 
    //         likes: 3 
    //     },
    //   ])
    //   assert.ok(result.author === 'Author A' || result.author === 'Author B')
    //   assert.strictEqual(result.blogs, 2)
    // })

