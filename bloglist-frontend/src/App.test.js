import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import App from './App'
jest.mock('./services/blogs')
jest.mock('./services/users')
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'

describe('<App />', () => {
    let app

    describe('when user is not logged', () => {
        beforeEach(() => {
            app = mount(<App />)
        })

        it('only login form is rendered', () => {
            app.update()
            const blogComponents = app.find('.blogLink')
            const loginForm = app.find(LoginForm)

            expect(blogComponents.length).toBe(0)
            expect(loginForm.text()).toBe(app.text())
        })

        it('it renders correctly', () => {
            const tree = renderer
                .create(<LoginForm login={() => null} />)
                .toJSON()
            expect(tree).toMatchSnapshot()
        })
    })

    describe('when user is logged', () => {
        beforeEach(() => {
            const user = {
                username: 'tester',
                token: '1231231214',
                name: 'Testaaja'
            }

            localStorage.setItem('loggedUser', JSON.stringify(user))
            app = mount(<App />)
        })

        it('all blogs are rendered as links', () => {
            app.update()
            const blogLinks = app.find('.blogLink')

            expect(blogLinks.length).toBe(blogService.blogs.length)
        })

        it('at first only the title and author are visible', () => {
            app.update()
            const blogLink = app.find('.blogLink').first()
            const details = app.find('.details')
            const firstBlog = blogService.blogs[0]

            expect(blogLink.text()).toEqual(firstBlog.title + ' ' + firstBlog.author)
            expect(details.length).toBe(0)
        })

        it('clicking a link opens the details of a blog', () => {
            app.update()
            const blogLink = app.find('.blogLink').first()
            blogLink.simulate('click', { button: 0 })

            const details = app.find(Blog)
            const firstBlog = blogService.blogs[0]

            expect(details.length).toBe(1)
            expect(details.text()).toContain(firstBlog.url && firstBlog.likes)
        })

        it('the details render correctly', () => {
            const f = () => null
            const tree = renderer
                .create(<Blog
                    blog={blogService.blogs[0]}
                    user={{ username: 'testUser' }}
                    removeBlog={f}
                    updateBlog={f}
                    addComment={f} />)
                .toJSON()
            expect(tree).toMatchSnapshot()
        })
    })
})