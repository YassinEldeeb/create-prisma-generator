import { kebabize } from './utils/kebabize'
import { logger } from './utils/logger'
import fs from 'fs'
import path from 'path'

const blogName = kebabize(process.argv[2] || '')

if (!blogName) {
  logger.error('Please Provide a name for the blog')
  logger.info('Like this:')
  logger.info('pnpm new-blog building-prisma-generator-together')
} else {
  const blogPath = path.join(process.cwd(), 'dev.to/blogs', blogName)
  const templateSource = path.join(__dirname, 'templates/addNewBlog')

  if (fs.existsSync(blogPath)) {
    logger.error('Blog already Exists!')
  } else {
    fs.mkdirSync(blogPath)
    fs.cpSync(templateSource, blogPath, {
      recursive: true,
    })
    const contentPath = path.join(blogPath, 'content.md')
    fs.writeFileSync(
      contentPath,
      fs.readFileSync(contentPath, 'utf-8').replace('$BLOG_NAME', blogName),
    )

    logger.success(`Your blog is ready at 'dev.to/blogs/${blogName}'`)
    console.log(`Start blogging ;)`)
  }
}
