# Initialize builder layer
FROM node:18-alpine AS builder
ENV NODE_ENV production
# Install necessary tools
RUN apk add --no-cache libc6-compat yq --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community
WORKDIR /app
# Copy the content of the project to the machine
COPY . .
RUN yq --inplace --output-format=json '.dependencies = .dependencies * (.devDependencies | to_entries | map(select(.key | test("^(typescript|@types/*|@upleveled/)"))) | from_entries)' package.json
RUN --mount=type=secret,id=blog_url \
    blog_url="$(cat /run/secrets/blog_url)"
RUN --mount=type=secret,id=content_api_key \
    content_api_key="$(cat /run/secrets/content_api_key)"
RUN yarn install --frozen-lockfile
RUN yarn build

# Initialize runner layer
FROM node:18-alpine AS runner
ENV NODE_ENV production

# Copy built app
COPY --from=builder /app/.next ./.next

# Copy only necessary files to run the app (minimize production app size, improve performance)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env.production ./

CMD ["yarn", "start"]