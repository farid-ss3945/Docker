FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /back
COPY . .
RUN dotnet restore
RUN dotnet build -c Release -o out
WORKDIR /back/out
CMD ["dotnet", "WebApplication5.dll"]