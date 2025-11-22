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

# Set default PORT (Railway will override if needed)
ENV PORT=5001

# Add healthcheck script with PORT support
RUN echo '#!/bin/sh\necho "=== Starting Manim Service ==="\necho "Python version: $(python3 --version)"\necho "Working directory: $(pwd)"\necho "Files: $(ls -la)"\necho "Port: ${PORT:-5001}"\necho "Testing imports..."\npython3 -c "import sys; print(f\"Python: {sys.executable}\"); import flask; print(f\"Flask: {flask.__version__}\"); import api; print(\"API import successful\")"\necho "Starting gunicorn..."\nexec gunicorn --bind 0.0.0.0:${PORT:-5001} --workers 2 --timeout 600 --graceful-timeout 600 --log-level info --access-logfile - --error-logfile - api:app' > /app/start.sh && chmod +x /app/start.sh

# Run with the startup script
CMD ["/bin/sh", "/app/start.sh"]
