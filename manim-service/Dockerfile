FROM manimcommunity/manim:v0.19.0

# Switch to root to install packages
USER root

# Set working directory
WORKDIR /app

# Copy requirements first to leverage cache
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create necessary directories with correct permissions
RUN mkdir -p media temp && \
    chmod -R 777 media temp

# Expose the port
EXPOSE 5001

# Run with gunicorn
# 4 workers, timeout 120s (rendering can take time)
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "2", "--timeout", "120", "api:app"]
