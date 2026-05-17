FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /back
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /back
COPY --from=build /back/out .
CMD ["dotnet", "WebApplication5.dll"]