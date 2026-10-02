using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Services.Interfaces;
using Priority1.ToDo.Core.Services;

var builder = WebApplication.CreateBuilder(args);

const string DevCorsPolicy = "AllowLocalDev";


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<ITodoListService, TodoListService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(DevCorsPolicy, policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Priority1.ToDo API v1");
        options.RoutePrefix = string.Empty;
    });

    app.UseCors(DevCorsPolicy);
}

app.MapControllers();

app.Run();
